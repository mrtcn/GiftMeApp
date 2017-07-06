import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = () => {
};

@Component({
    selector: 'datepicker-input',
    styleUrls: ['/gift-datepicker.scss'],
    template: '<ion-label>Date</ion-label><ion-datetime displayFormat="MMMM YYYY" min="2016" max="2020-10-31" [(ngModel)]="value"></ion-datetime>',
    providers: [
    {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GiftDatePickerComponent),
            multi: true
    }]
})

export class GiftDatePickerComponent implements ControlValueAccessor {
    //The internal data model
    private innerValue: any = '';

    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
