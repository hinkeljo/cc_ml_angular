import { Injectable } from '@angular/core';
import { Fact } from './interfaces/Fact';
import { SearchResult } from './interfaces/SearchResult';

@Injectable({
  providedIn: 'root'
})
export class RemoteService {

  constructor() { }

  private api_url: string = "https://api.chucknorris.io";

  async httpRequest<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  
  /** Returns an array of the available categories as strings */
  async getCategories(): Promise<string[]> {
    let categories: string[] = await this.httpRequest<string[]>(`${this.api_url}/jokes/categories`);
    return categories; 
  }

  /** Returns a random fact from the provided category.
   * Uses a random category if category is not provided
   */
  async getRandomFact(category: string | undefined = undefined): Promise<Fact> {
    let fact: Fact; 
    let request_parameter: string = ""; 
    if(category != undefined) {
      request_parameter = `?category=${category}`;
    }
    fact = await this.httpRequest<Fact>(`${this.api_url}/jokes/random${request_parameter}`);
    return fact; 
  }

  /** Returns the first found fact from the users search query and category */
  async searchFact(search: string, category: string | undefined): Promise<Fact> {
    let results: SearchResult; 
    let category_parameter: string = "";
    if(category != undefined) {
      category_parameter = `&category=${category}`;
    }
    results = await this.httpRequest<SearchResult>(`${this.api_url}/jokes/search?query=${search}${category_parameter}`);
    if(results.result.length > 0) {
      // return first fact
      return results.result[0];
    } else throw new Error(`No results found!`);
  }
}
