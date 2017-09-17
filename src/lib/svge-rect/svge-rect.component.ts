import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

export interface SvgeRectModel {
  position?: SvgePositioning;
  style?: SvgeStyling;
  dragStyle?: SvgeStyling;
  dragPlaceHolderStyle?: SvgeStyling;
}

export interface SvgeStyling {
  fill?: string;
  fillOpacity?: string;
  stroke?: string;
  strokeDashArray?: string;
  strokeOpacity?: string;
  strokeWidth?: string;
}

export interface SvgePositioning {
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

@Component({
  selector: 'svg:g[svge-rect]',
  host: {
    'config': 'config',
    'text': 'text',
    'draggable': 'draggable',
  },
  template:
    '<svg:rect [attr.width]="config.position.width"\n' +
    '          [attr.height]="config.position.height"\n' +
    '          [attr.x]="config.position.x"\n' +
    '          [attr.y]="config.position.y"\n' +
    '          [attr.transform]="dragTransform()"\n' +
    '          [attr.stroke]="config.style.stroke"\n' +
    '          [attr.stroke-dasharray]="config.style.strokeDashArray"\n' +
    '          [attr.stroke-opacity]="config.style.strokeOpacity"\n' +
    '          [attr.stroke-width]="config.style.strokeWidth"\n' +
    '          [attr.fill]="config.style.fill"\n' +
    '          [attr.fill-opacity]="config.style.fillOpacity">\n' +
    '</svg:rect>\n' +
    '<svg:text text-anchor="middle"\n' +
    '          style="pointer-events:none;"\n' +
    '          [attr.transform]="textTransform()"\n' +
    '          [attr.dx]="textLayout.position.x"\n' +
    '          [attr.dy]="textLayout.position.y">\n' +
    '  {{text}}\n' +
    '</svg:text>'
})
export class SvgeRectComponent implements OnInit {


  @Input() config: SvgeRectModel;
  @Input() text: string;
  @Input() draggable = false;
  originalStyle: SvgeStyling;
  dragLastXy: [number, number];
  dragTransformMatrix = [1, 0, 0, 1, 0, 0];
  textTransformMatrix = [1, 0, 0, 1, 0, 0];
  leftMouseDown = false;
  textLayout: SvgeRectModel;
  @Output() dragStart: EventEmitter<SvgeRectComponent> = new EventEmitter<SvgeRectComponent>();
  @Output() dragEnd: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() init: EventEmitter<SvgeRectComponent> = new EventEmitter<SvgeRectComponent>();
  defaultStyle: SvgeStyling;
  defaultDragStyle: SvgeStyling;
  defaultDragPlaceHolderStyle: SvgeStyling;

  private _dragging = false;
  get dragging(): boolean {
    return this._dragging;
  }
  set dragging(value: boolean) {
    this._dragging = value;
  }

  constructor(public elRef: ElementRef) { }

  ngOnInit() {
    const position = this.config.position;
    this.textLayout = {
      position: {
        x: position.width / 2,
        y: position.height / 2
      }
    };
    this.textTransformMatrix[4] = position.x;
    this.textTransformMatrix[5] = position.y;
    this.originalStyle = this.config.style;
    this.setupDefaultStyles();
    if (this.draggable) {
      this.ensureDragStyles();
    }
    this.init.emit(this);
  }

  setupDefaultStyles() {
    this.defaultStyle = {
      fill: '#FFFFFF',
      stroke: '#000000'
    };
    this.defaultDragStyle = {
      fill: this.defaultStyle.fill,
      fillOpacity: '0.5',
      stroke: this.defaultStyle.stroke,
      strokeOpacity: '0.5',
      strokeDashArray: '5, 5'
    };
    this.defaultDragPlaceHolderStyle = {
      fill: this.config.style.stroke || this.defaultStyle.stroke,
      stroke: this.config.style.fill || this.defaultStyle.fill,
      strokeDashArray: '5, 5'
    };
  }

  textTransform() {
    return `matrix(${this.textTransformMatrix.join(' ')})`;
  }

  dragTransform() {
    return `matrix(${this.dragTransformMatrix.join(' ')})`;
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    this.leftMouseDown = event.which === 1;
    if (event.which === 1 && this.draggable && !this.dragging) {
      setTimeout(() => {
        if (!this.dragging && this.leftMouseDown) {
          this.startDrag(event);
        }
      }, 200); }
  }

  @HostListener('mouseup') onMouseUp() {
    if (this.dragging) {
      this.endDrag(true);
      return;
    }
    this.leftMouseDown = false;
  };

  @HostListener('mousemove', ['$event']) onHover(event: MouseEvent) {
    if (event.which === 1) {
      event.preventDefault();
    }
  }


  private startDrag(event: MouseEvent) {
    this.dragging = true;
    this.dragLastXy = [event.clientX, event.clientY];
    this.config.style = this.config.dragPlaceHolderStyle;
    this.dragStart.emit(this);

  }

  endDrag(success: boolean) {
    this.leftMouseDown = this.dragging = false;
    this.config.style = this.originalStyle;
    this.dragEnd.emit(success);
  }

  private ensureDragStyles() {
    this.ensureDragStyle('dragStyle', 'defaultDragStyle');
    this.ensureDragStyle('dragPlaceHolderStyle', 'defaultDragPlaceHolderStyle');
  }
  private ensureDragStyle(configStyle: string, defaultStyle: string) {
    if (!this.config[configStyle]) {
      this.config[configStyle] = this[defaultStyle];
      return;
    }
    this.config[configStyle] = { ...this[defaultStyle], ...this.config[configStyle] };
  }
}
