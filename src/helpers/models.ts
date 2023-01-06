
import { Chapter, Manga, ChapterDetails, Tag, SearchOperator } from 'paperback-extensions-common'

export interface MangaSource {

    id: string,
    name: string,
    author: string,
    desc: string,
    website: string,
    contentRating: string,
    version: string,
    icon: string,
    tags: [
        {
            text: string,
            type: string
        },
        {
            text: string,
            type: string
        }
    ],
    websiteBaseURL: string,
    filePath: string

}

export interface Todo {
    id: number;
    content: string;
}

export interface Meta {
    totalCount: number;
}


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
