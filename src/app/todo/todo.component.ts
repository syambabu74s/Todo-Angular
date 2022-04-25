import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  accessToken:any;
  formGroup:any;
  registerForm:any;
  todoForm:any;
  userInfo:any;
  closeResult = '';
  todoText: string = "";
  todoList: any = [];
  isTodoListEmpty = false;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private modalService: NgbModal,private authService:AuthService,private toastr: ToastrService,private spinner: NgxSpinnerService) { }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  ngOnInit() 
  {
    this.accessToken=localStorage.getItem("accessToken");
    this.initForm();
    this.isTodoListEmpty=true;
    if(this.accessToken === null)
    {
      
    }
    else
    {
      this.getUserDetails();
      this.getUserTodoList();
    }
  }
  initForm()
  {
      this.formGroup=new FormGroup({
        email:new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
        password:new FormControl('',Validators.required),
      });
      this.registerForm=new FormGroup({
        name:new FormControl('',Validators.required),
        email:new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
        password:new FormControl('',Validators.required),
      });
      this.todoForm=new FormGroup({
        title:new FormControl('',Validators.required),
        description:new FormControl('',Validators.required),
      });
  }
  getUserDetails()
  {
    this.authService.getUserDetails().subscribe(
      data => {
          this.userInfo=data;
      },
      _error => 
      {
        this.logout();
        console.log("Un authorized User");
      }
    )
  }
  getUserTodoList()
  {
    this.authService.getUserTodoList().subscribe(
      data => {
        this.spinner.hide();
        this.todoList=data;
        console.log(this.userInfo);
      }
    )
  }
  userLogin() {
    if(this.formGroup.valid)
    {
      this.spinner.show();
      this.authService.login(this.formGroup.value).subscribe(
        data => {
          this.spinner.hide();
          const accessToken=data.access_token;
          const refreshToken="";
          localStorage.setItem("accessToken",accessToken);
          localStorage.setItem("refreshToken",refreshToken);
          
          this.toastr.success('Successfully loggedin');
          this.modalService.dismissAll();
          this.ngOnInit();
        },
        _error => 
        {
          this.spinner.hide();
          this.toastr.error('Please use correct details to login');
          return false;
        }
      )
    }
  }
  userRegister() {
    if(this.registerForm.valid)
    {
      this.spinner.show();
      this.authService.register(this.registerForm.value).subscribe(
        data => {
            if(data.status=='error')
            {
              this.spinner.hide();
              this.toastr.error(data.message);
            }
            else
            {
              this.spinner.hide();
              const accessToken=data.access_token;
              const refreshToken="";
              localStorage.setItem("accessToken",accessToken);
              localStorage.setItem("refreshToken",refreshToken);
              this.toastr.success('Successfully registered');
              this.modalService.dismissAll();
              this.ngOnInit();
            }
        },
        _error => 
        {
          this.spinner.hide();
          this.toastr.error('Please use correct details to login');
          return false;
        }
      )
    }
  }
  createTodo() 
  {
    if(this.todoForm.valid)
    {
      this.spinner.show();
      this.authService.createTodo(this.todoForm.value).subscribe(
        data => {
            if(data.status=='error')
            {
              this.spinner.hide();
              this.toastr.error(data.message);
            }
            else
            {
              this.spinner.hide();
              this.toastr.success('Successfully Created New Todo Item');
              this.ngOnInit();
            }
        },
        _error => 
        {
          this.spinner.hide();
          this.toastr.error('Please use correct details to add');
          return false;
        }
      )
    }
  }
  logout()
  {
    localStorage.removeItem("accessToken");
    localStorage.removeItem('refreshToken');
    this.userInfo="";
    this.todoList=[];
    this.ngOnInit();
  }
  onTaskStatusUpdation(todoId:number,status:string){
    this.spinner.show();
    const data=
    {
      "status":status
    };
    this.authService.updateStatus(data,todoId).subscribe(
      data => {
          if(data.status=='error')
          {
            this.spinner.hide();
            this.toastr.error(data.message);
          }
          else
          {
            this.spinner.hide();
            this.toastr.success('Successfully updated status');
            this.ngOnInit();
          }
      },
      _error => 
      {
        this.spinner.hide();
        this.toastr.error('Please use correct details to add');
        return false;
      }
    )
  }
  deleteTaskItem(todoId:number)
  {
    this.authService.deleteItem(todoId).subscribe(
      data => {
          if(data.status=='error')
          {
            this.spinner.hide();
            this.toastr.error(data.message);
          }
          else
          {
            this.spinner.hide();
            this.toastr.success('Successfully removed the item');
            this.ngOnInit();
          }
      },
      _error => 
      {
        this.spinner.hide();
        this.toastr.error('Please use correct details to add');
        return false;
      }
    )
  }
  private getDismissReason(reason: any): string 
  {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
