import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Sale } from './model/Sale';
import { SaleService } from './sale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  @ViewChild('readOnlyTemplate',{static:false}) readOnlyTemplate!:TemplateRef<any>;
  @ViewChild('editTemplate', { static: false }) editTemplate!: TemplateRef<any>;
  selectedFiles?:FileList;
  currentFile: any;
  editedSale:Sale=new Sale();
  sales:Sale[]=[];
  isNewRecord:boolean=false;
  statusMessage:string="";
  title = 'SaleParser';

  constructor(private saleService:SaleService){}
  ngAfterViewInit(): void {
    this.loadSales();
  }

  selectFile(event:any){
    this.selectedFiles=event.target.files;
  }
  loadSales(){
    this.saleService.getAllSales().subscribe(
      data=>{this.sales=data},
      error=>{console.error(error);this.statusMessage=error}
    )
  }
  loadTemplate(sale:Sale){
    if(this.editedSale && this.editedSale.id==sale.id){
      this.editTemplate.createEmbeddedView(this);
      return this.editTemplate;
    }
    else{
      this.readOnlyTemplate.createEmbeddedView(this);
      return this.readOnlyTemplate;
    }
  }
  addSale(){
    this.editedSale=new Sale();
    this.sales.push(this.editedSale);
    this.isNewRecord=true;
  }
  editSale(sale:Sale){
    this.editedSale=sale;
  }
  deleteSale(id:number){
    this.saleService.deleteSale(id).subscribe(
      data=>{console.log(data);this.loadSales()},
      error=>{console.error(error);this.statusMessage=error;}
    );
    this.loadSales();
  }
  saveSale(){
    if(this.isNewRecord){
      this.saleService.createSale(this.editedSale).subscribe(
        data=>{console.log(data);this.loadSales()},
        error=>{console.error(error);this.statusMessage=error}
      )
    }
    else{
      if(this.editedSale.id)
        this.saleService.updateSale(this.editedSale,this.editedSale.id).subscribe(
          data=>{console.log(data);this.loadSales()},
          error=>{console.error(error);this.statusMessage=error}
        );
    }
  }
  cancel(){
    if(this.isNewRecord){
      this.sales.pop();
      this.isNewRecord=false;
    }
    this.editedSale=new Sale()
  }
  onSubmit(){
    if(this.selectedFiles){
      this.currentFile=this.selectedFiles.item(0);
      this.saleService.parseFile(this.currentFile).subscribe(
        data=>{console.log(data);this.loadSales()},
        error=>{console.error(error);this.statusMessage=error;}
      );
  }
  }
}
