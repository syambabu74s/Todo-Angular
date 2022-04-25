import{Injectable} from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import { baseUrl } from "src/environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt"

@Injectable({
    providedIn:"root"
})
export class AuthService{
    constructor(private http:HttpClient){}
    public userInfo:BehaviorSubject<any> = new BehaviorSubject(null);
    jwthelper= new JwtHelperService();
    register(data:any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      return this.http.post<any>(
        baseUrl+'register',
        data,
        { headers }
      );
    }
    login(data:any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        return this.http.post<any>(
          baseUrl+'login',
          data,
          { headers }
        );
    }
    getUserDetails(): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      return this.http.get<any>(
        baseUrl+'user',
        { headers }
      );
    }
    createTodo(data:any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      return this.http.post<any>(
        baseUrl+'todo',
        data,
        { headers }
      );
    }
    updateStatus(data:any,todoId:any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      return this.http.put<any>(
        baseUrl+'todo/'+todoId,
        data,
        { headers }
      );
    }
    deleteItem(todoId:any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      return this.http.delete<any>(
        baseUrl+'todo/'+todoId,
        { headers }
      );
    }
    getUserTodoList(): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      return this.http.get<any>(
        baseUrl+'todos',
        { headers }
      );
    }
}