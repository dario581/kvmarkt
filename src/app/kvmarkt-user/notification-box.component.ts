import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-kvuser-notification-box',
    template: `
        <div class="notification-box">
            <span (click)="onClose()">x</span>

            <svg width="100%" height="100%" viewBox="0 0 175 175" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                <rect id="ArtBoard1" x="0" y="0" width="174.742" height="174.742" style="fill:none;" />
                <clipPath id="_clip1">
                <rect id="ArtBoard11" serif:id="ArtBoard1" x="0" y="0" width="174.742" height="174.742" />
                </clipPath>
                <g clip-path="url(#_clip1)">
                <path d="M78.103,47.974c1.833,-3.414 5.393,-5.544 9.268,-5.544c3.874,0 7.435,2.13 9.267,5.544c11.779,21.947 31.937,59.505 43.242,80.569c1.75,3.26 1.658,7.199 -0.241,10.374c-1.899,3.174 -5.327,5.118 -9.026,5.118c-23.089,0 -63.395,0 -86.484,0c-3.7,0 -7.127,-1.944 -9.026,-5.118c-1.899,-3.175 -1.991,-7.114 -0.242,-10.374c11.305,-21.064 31.463,-58.622 43.242,-80.569Z"
                    />
                <path d="M87.371,72.324l0,36.566"  />
                <path d="M87.371,124.584l0,0.324"  />
                </g>
            </svg>
            <h3>Fehler</h3>
            <p>Die Aktion konnte nicht durchgeführt werden. Versuche es evtl. später erneut. (Code: {{notification?.title}})</p>
        </div>
    `,
    styleUrls: ['./kvmarkt-user.component.css'],
})
export class NotificationBoxComponent {
    @Input('notification') notification: {title: string, message: string};

    @Output() close = new EventEmitter();

    onClose() {
        this.close.emit(null);
    }
}
