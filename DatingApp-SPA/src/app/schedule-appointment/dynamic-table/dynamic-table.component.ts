import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit, OnChanges {
  @Input() tableHeads: Array<string> = new Array<string>();
  @Input() tableDatas: Array<any> = new Array<any>();
  @Input() tableColName: Array<string> = new Array<string>();
  public tableColNameGenerated: Array<string> = new Array<string>();
  private isTableColNameSet = false;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableHeads) {
      if (this.tableHeads.length > 0) {
        // console.log('tableHeads');
      }
    }

    // tslint:disable-next-line:no-string-literal
    if (changes['tableDatas']) {
      if (!this.isTableColNameSet) {
        if (this.tableDatas.length > 0) {
          this.tableColNameGenerated = this.getKeys(this.tableDatas[0]);
          if (!this.isHeadAndColLengthSame(this.tableHeads, this.tableColNameGenerated)) {
            console.error('Table column row is not same as with property name in self generated');
         }
        }
      }
    }

    // tslint:disable-next-line:no-string-literal
    if (changes['tableColName']) {
      if (this.tableColName.length > 0) {
        this.tableColNameGenerated = this.tableColName;
        this.isTableColNameSet = true;
        if (!this.isHeadAndColLengthSame(this.tableHeads, this.tableColName)) {
          console.error('Table column row is not same as with property name provided');
        }
      }
    }
  }


 private isHeadAndColLengthSame(head: Array<string>, col: Array<string>): boolean {
  return (head.length === col.length);
}

private getKeys(value: any): Array<string> {
  return Object.keys(value);
}

}
