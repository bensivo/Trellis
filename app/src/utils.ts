export function isElectron(): boolean {
    return (window as any).electron !== undefined;
}