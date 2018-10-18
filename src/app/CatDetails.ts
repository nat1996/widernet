class CatDetails {
    URL: string;
    LastReview: string;
    CategoryID: number;
    Logins: string;

    public CatDetails() {
        this.URL = '';
        this.LastReview = '';
        this.CategoryID = -1;
        this.Logins = '';
    }

    public getURL(): string {
        return this.URL;
    }

    public setURL(url: string): void {
        this.URL = url;
    }

    public getLastReview(): string {
        return this.LastReview;
    }

    public setLastReview(LastReview: string): void {
        this.LastReview = LastReview;
    }

    public getCategoryID(): number {
        return this.CategoryID;
    }

    public setCategoryID(id: number): void {
        this.CategoryID = id;
    }

    public getLogins(): string {
        return this.Logins;
    }

    public setLogins(logins: string): void {
        this.Logins = logins;
    }
 }