import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { SchedulePage } from '../schedule/schedule';
import { MapPage } from '../map/map';
import { AboutPage } from '../about/about';
import { SpeakerListPage } from '../speaker-list/speaker-list';



@Component({
    templateUrl: 'tabs.html'
})

export class TabsPage {
        tab1Root: any = HelloIonicPage;
        tab2Root: any = SchedulePage;
        tab3Root: any = MapPage;
        tab4Root: any = AboutPage;
        tab5Root: any = SpeakerListPage;

        mySelectedIndex: number;
            
    constructor(NavParams: NavParams) {
        this.mySelectedIndex = NavParams.data.tabIndex || 0;
    }
}

