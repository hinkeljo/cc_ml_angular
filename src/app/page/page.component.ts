import { Component, OnInit } from '@angular/core';
import { RemoteService } from '../remote.service';
import { Category } from '../interfaces/Category';
import { Fact } from '../interfaces/Fact';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  constructor(
    private api: RemoteService
  ) {}

  async ngOnInit(): Promise<void> {
    // add random category
    let random_category: Category = {
      name: "Random", 
      value: undefined
    };
    this.categories.push(random_category);
    // select random cateogry by default
    this.selected_category = random_category;
    // fetch all available categories
    let remote_categories = await this.api.getCategories();
    remote_categories.forEach((category) => {
      this.categories.push({
        name: category, 
        value: category
      });
    });
    // only for debugging purposes
    console.log("Available categories:");
    console.log(this.categories);
  }

  public categories: Category[] = []; 
  public selected_category: Category | undefined; 
  public search_query: string = ""; 

  public fact: Fact | undefined = undefined; 
  public error: string | undefined = ""; 

  public async getFact() {
    // reset error state
    this.error = undefined; 
    
    console.log(`Fetching new fact from category ${this.selected_category?.name} with search query ${this.search_query}`);
    let category = this.selected_category ? this.selected_category.value : undefined; 
    // if search query is empty, return random fact
    // if query is provided, search for a fact
    try {
      if(this.search_query == "") {
        this.fact = await this.api.getRandomFact(category);
      } else {
        this.fact = await this.api.searchFact(this.search_query, category);
      }
    } catch(error: any) {
      this.error = error.toString(); 
    }
    console.log(this.fact);
  }
}
