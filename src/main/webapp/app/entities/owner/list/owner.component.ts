import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOwner } from '../owner.model';
import { OwnerService } from '../service/owner.service';
import { OwnerDeleteDialogComponent } from '../delete/owner-delete-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'jhi-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss'],
})
export class OwnerComponent implements OnInit {
  public displayedColumns = ['name', 'address'];
  public dataSource = new MatTableDataSource<IOwner>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private repoService: OwnerService) {}

  ngOnInit(): any {
    this.getAllOwners();
  }

  public getAllOwners = (): any => {
    this.repoService.getAll().subscribe((res: IOwner[]) => {
      this.dataSource.data = res;
    });
  };

  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  // }

  public doFilter = (value: string): any => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
}
