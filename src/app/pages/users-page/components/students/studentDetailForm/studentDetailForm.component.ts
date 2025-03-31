import { Component } from '@angular/core';
import { ParentFormComponent } from "../parentForm/parentForm.component";

@Component({
  selector: 'app-student-detail-form',
  imports: [ParentFormComponent],
  templateUrl: './studentDetailForm.component.html',
})
export class StudentDetailFormComponent {
  
  isVisibleParentForm: boolean = false;
  
  
  changeParentFormVisibility(event: Event) {
    event?.preventDefault()
    if(this.isVisibleParentForm){
      this.isVisibleParentForm = false;
    }else{
      this.isVisibleParentForm = true;
    }
    console.log(this.isVisibleParentForm);
    

  }

}
