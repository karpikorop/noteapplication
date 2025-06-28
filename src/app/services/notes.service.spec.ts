import { NotesService, NoteData } from './notes.service';
import { Firestore } from '@angular/fire/firestore';

// 1. Імпортуємо функції, які ми будемо мокувати
import { collection, addDoc, doc, deleteDoc } from '@angular/fire/firestore';

// 2. Мокуємо весь модуль, як і раніше. Це ключ до всього.
jest.mock('@angular/fire/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
}));

describe('NotesService', () => {

    let service: NotesService;
    // Створюємо пустий об'єкт, який буде імітувати Firestore.
    // Його єдина мета - бути переданим в конструктор.
    const firestoreMock = {};

    beforeEach(() => {
        // Створюємо сервіс напряму, як звичайний клас
        service = new NotesService(firestoreMock as Firestore);
    });

    // Очищуємо моки після кожного тесту
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call collection and addDoc when adding a new note', async () => {
        // Arrange
        // ▼▼▼ ОСНОВНЕ ВИПРАВЛЕННЯ: Кажемо моку collection повертати об'єкт-заглушку ▼▼▼
        (collection as jest.Mock).mockReturnValue({} as any);
        // ▲▲▲ КІНЕЦЬ ВИПРАВЛЕННЯ ▲▲▲
        (addDoc as jest.Mock).mockResolvedValue({ id: 'test-id' });

        const noteData: NoteData = {
            title: 'Test Note',
            content: 'Test Content',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Act
        await service.addNote(noteData);

        // Assert
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'notes');
        expect(addDoc).toHaveBeenCalledWith(expect.anything(), noteData);
    });

    // Додаємо новий тест для методу deleteNote
    it('should call doc and deleteDoc when deleting a note', async () => {
        // Arrange
        const noteId = 'test-delete-id';
        const docRefMock = { id: noteId }; // Фальшиве посилання на документ
        (doc as jest.Mock).mockReturnValue(docRefMock);
        (deleteDoc as jest.Mock).mockResolvedValue(undefined); // deleteDoc повертає Promise<void>

        // Act
        await service.deleteNote(noteId);

        // Assert
        // Перевіряємо, чи був викликаний doc з правильним шляхом
        expect(doc).toHaveBeenCalledWith(expect.anything(), `notes/${noteId}`);
        // Перевіряємо, чи був викликаний deleteDoc з правильним посиланням
        expect(deleteDoc).toHaveBeenCalledWith(docRefMock);
    });
});
