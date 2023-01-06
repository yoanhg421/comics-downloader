
import { Chapter, Manga, ChapterDetails, Tag, SearchOperator } from 'paperback-extensions-common'

export enum MangaStatus {
    ONGOING = 1,
    COMPLETED = 0,
    UNKNOWN = 2,
    ABANDONED = 3,
    HIATUS = 4
}

export declare interface DownloadRequest {
    manga: Manga
    chapters: Chapter[]
    chapterDetails: ChapterDetails[]
    cbr: boolean

}


export interface Metadata {
    /**
     * The title of the search request. This usually is the plaintext query you are
     * making as a user
     */
    title?: string;
    includedTags?: Tag[];
    excludedTags?: Tag[];
    includeOperator?: SearchOperator;
    excludeOperator?: SearchOperator;
    /**
* This is basically anything other than tags that the user enters such as:
* author: ShindoL author: Miyazuki
* where `author` would be the key and `ShindoL`, `Myazuki` would be the values.
*/
    // parameters: Record<string, string[]>;
}
