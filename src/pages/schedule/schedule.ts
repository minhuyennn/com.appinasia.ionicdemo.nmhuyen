import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { SessionDetailPage } from '../session-detail/session-detail';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';


@Component({
    selector: 'page-schedele',
    templateUrl: 'schedule.html'
})
export class SchedulePage {

    @ViewChild('scheduleList', { read: List }) scheduleList: List;

    dayIndex = 0;
    queryText = '';
    segment = 'all';
    excludeTracks: any = [];
    shownSessions: any = [];
    groups: any = [];
    confDate: string;

    constructor(
        public alertCtrl: AlertController,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public confData: ConferenceData,
        public user: UserData
    ) { }

    ionViewDidLoad() {
        this.app.setTitle('Schedule');
        this.updateSchedule();
    }

    updateSchedule() {
        this.scheduleList && this.scheduleList.closeSlidingItems();

        this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
            this.shownSessions = data.shownSessions;
            this.groups = data.groups;
        });

    }

    presentFilter() {
        let modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
        modal.present();

        modal.onWillDismiss((data: any[]) => {
            if (data) {
                this.excludeTracks = data;
                this.updateSchedule;
            }
        });
    }

    goToSessionDetail(sessionData: any) {
        this.navCtrl.push(SessionDetailPage, {
            name: sessionData.name,
            session: sessionData
        })
    }

    addFavorite(slidingItem: ItemSliding, sessionData: any) {
        if (this.user.hasFavorite(sessionData.name)) {
            this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
        } else {
            this.user.addFavorite(sessionData.name);

            let alert = this.alertCtrl.create({
                title: 'Favorite Added',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        slidingItem.close();
                    }
                }]
            });
            alert.present();
        }
    }

    removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
        let alert = this.alertCtrl.create({
            title: title,
            message: 'Would you like to remove this session from your favorites?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        slidingItem.close();
                    }
                },
                {
                    text: 'Remove',
                    handler: () => {
                        this.user.removeFavorite(sessionData.name);
                        this.updateSchedule();

                        slidingItem.close();
                    }
                }
            ]
        });
        alert.present();
    }

    openSocial(network: string, fab: FabContainer) {
        let loading = this.loadingCtrl.create({
            content: `Posting to ${network}`,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(() => {
            fab.close();
        });
        loading.present();
    }

    doRefresh(refresher: Refresher) {
        this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
            this.shownSessions = data.shownSessions;
            this.groups = data.groups;

            // simulate a network request that would take longer
            // than just pulling from out local json file
            setTimeout(() => {
                refresher.complete();

                const toast = this.toastCtrl.create({
                    message: 'Sessions have been updated.',
                    duration: 3000
                });
                toast.present();
            }, 1000);
        });
    }
}
