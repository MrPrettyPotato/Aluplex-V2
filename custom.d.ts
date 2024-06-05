declare const klant: any;

declare global {
    interface Window {
        typeafwerkingChange: (value: string) => void;
    }
}