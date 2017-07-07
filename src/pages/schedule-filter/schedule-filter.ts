import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';

@Component({
    selector: 'page-schedule-filter',
    templateUrl: 'schedule-filter.html'
})

export class ScheduleFilterPage {
    tracks: Array<{ name: string, isChecked: boolean }> = [];

constructor(
    public confData: ConferenceData,
    public navParams: NavParams,
    public viewCtrl: ViewController
) {
        
    let excludedTrackNames = this.navParams.data;

    this.confData.getTracks().subscribe((trackNames: string[]) => {

        trackNames.forEach(trackName => {
            this.tracks.push({
                name: trackName,
                isChecked: (excludedTrackNames.indexOf(trackName) === -1)
            });
        });

    });
}

    resetFilters() {
        this.tracks.forEach(track => {
            track.isChecked = true;
        });
    }

    applyFilter() {
        let excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
        this.dismiss(excludedTrackNames);
    }

    dismiss(data?: any) {
        this.viewCtrl.dismiss(data);
    }

}