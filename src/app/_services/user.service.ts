﻿import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import {URLSearchParams, Jsonp} from '@angular/http';


import {User} from '../_models/user';
import {Observable} from "rxjs";

@Injectable()
export class UserService {
  constructor(private http: Http, private _jsonp: Jsonp) {
  }

  getAll() {
    return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
  }

  getById(id: number) {
    return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
  }

  create(user: User) {
    return this.http.post('http://localhost:8090/auth/register', user, this.jwt()).map((response: Response) => response.json());
  }

  update(user: User) {
    return this.http.put('/api/users/' + user._id, user, this.jwt()).map((response: Response) => response.json());
  }

  delete(id: number) {
    return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
  }

  search(term: string) {
    if (term === '') {
      return Observable.of([]);
    }

    let searchUrl = 'http://localhost:8090/users/search';

    let params = new URLSearchParams();
    params.set('field', 'name');
    params.set('q', term);

    let options = this.jwt();
    options.search = params;

    return this.http
      .get(searchUrl, options)
      .map(response => <string[]> response.json());

  }


  getByEmail(term: string) {
    return this.http
      .get('http://localhost:8090/users/' + term, this.jwt())
      .map(response => response.json());
  }

  makeFriendShip(id: string) {
    return this.http
      .get('http://localhost:8090/follow/' + id, this.jwt())
      .map(response => response.json());
  }

  private jwt() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({'Authorization': 'Bearer ' + currentUser.token});
      return new RequestOptions({headers: headers});
    }
  }
}
