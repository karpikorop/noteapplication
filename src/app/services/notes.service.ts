import {Injectable} from '@angular/core';
import {
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    docData,
    Firestore, orderBy, query, setDoc,
} from '@angular/fire/firestore';
import {filter, map, Observable, Timestamp} from 'rxjs';
import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';



export interface NoteData {
    title: string;
    content?: string;
    createdAt: Date;
    updatedAt?: Date;
}
export interface Note extends NoteData {
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotesService {

    constructor(private firestore: Firestore) {
    }

    public getNotes(): Observable<Note[]> {

        const notesCollection = query(
            collection(this.firestore, 'notes').withConverter(noteConverter),
            orderBy('createdAt', 'desc'),
        );
        return collectionData(notesCollection);
    }

    public getNoteById(id: string): Observable<Note | undefined> {

        const noteRef = doc(this.firestore, `notes/${id}`).withConverter(noteConverter);

        return docData(noteRef);
    }

    public addNote(note: NoteData): Promise<string> {

        const notesCollection = collection(this.firestore, 'notes');

        // 2. Ми повертаємо результат всього ланцюжка промісів
        return addDoc(notesCollection, note)
            .then(docRef => {
                console.log("Document created with ID:", docRef.id);
                return docRef.id;
            })
            .catch((error: Error) => {
                console.error("Error creating document:", error);
                throw error;
            });
    }

    public async deleteNote(noteOrId: string | Note) {

        const noteId = typeof noteOrId === 'string' ? noteOrId : noteOrId.id;

        const noteDoc = doc(this.firestore, `notes/${noteId}`);

        try {
            await deleteDoc(noteDoc);
            console.log(`Document with ID ${noteId} successfully deleted.`);
        } catch (error) {
            console.error(`Error while deleting document ${noteId}:`, error);
            throw error;
        }
    }

    public updateNote(note: Note) {
        const notesDoc = doc(this.firestore, `notes/${note.id}`).withConverter(noteConverter);

        return setDoc(notesDoc, note, {merge: true}).then(docRef => {
            console.log(`Document with ID ${note.id} successfully updated.`);
        }).catch(error => {
            console.error(`Error updating document ${note.id}:`, error);
            throw error;
        });
    }

}

const noteConverter: FirestoreDataConverter<Note> = {

    // Firestore автоматично конвертує Date -> Timestamp
    toFirestore(note: Note): DocumentData {
        return {
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        };
    },

    fromFirestore(snapshot: QueryDocumentSnapshot): Note {
        const data = snapshot.data();
        return {
            id: snapshot.id, // ID тут доступний напряму зі snapshot
            title: data['title'],
            content: data['content'],
            createdAt: data['createdAt']?.toDate(), // Конвертуємо Timestamp в Date
            updatedAt: data['updatedAt']?.toDate()  // Конвертуємо Timestamp в Date
        } as Note;
    }
};
