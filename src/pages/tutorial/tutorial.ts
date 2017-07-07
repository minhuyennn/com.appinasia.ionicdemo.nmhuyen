import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-tutorial',
    templateUrl: 'tutorial.html'
})

export class TutorialPage{
    showSkip = true;

    @ViewChild('slides') slides: Slides;

    constructor(
        public navCtrl: NavController,
        public menu: MenuController,
        public storage: Storage
    ) {}

    startApp() {
        this.navCtrl.push(TabsPage).then(() => {
            this.storage.set('hasSeenTutorial', 'true');
        })
    }

    onSlideChangeStart(slider: Slides) {
        this.showSkip = !slider.isEnd();
    }

    ionViewWillEnter() {
        this.slides.update();
    }

    ionViewDidEnter() {
        this.menu.enable(false);
    }

    ionViewDidLeave() {
        this.menu.enable(true);
    } 

}