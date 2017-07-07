import { Injectable } from '@angular/core';
import { UserData } from './user-data';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class ConferenceData {
    data: any;

    constructor(public http: Http,
        public user: UserData) { }

    load(): any {
        if (this.data) {
            return Observable.of(this.data);
        } else {
            return this.http.get('assets/data/data.json').map(this.processData, this);

        }
    }

    processData(data: any) {

        this.data = data.json();
        this.data.tracks = [];

        this.data.schedule.forEach((day: any) => {
            day.groups.forEach((group: any) => {
                group.sessions.forEach((session: any) => {
                    session.speakers = [];
                    if (session.speakerNames) {
                        session.speakerNames.forEach((speakerName: any) => {
                            let speaker = this.data.speakers.find((s: any) => s.name === speakerName);
                            if (speaker) {
                                session.speakers.push(speaker);
                                speaker.sessions = speaker.sessions || [];
                                speaker.sessions.push(session);
                            }
                        });
                    }
                    if (session.tracks) {
                        session.tracks.forEach((track: any) => {
                            if (this.data.tracks.indexOf(track) < 0) {
                                this.data.tracks.push(track);
                            }
                        })
                    }
                });
            });
        });
        return this.data;
    }

    getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
        return this.load().map((data: any) => {
            let day = data.schedule[dayIndex];
            day.shownSessions = 0;

            queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
            let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

            day.groups.forEach((group: any) => {
                group.hide = true;

                group.sessions.forEach((session: any) => {
                    this.filterSession(session, queryWords, excludeTracks, segment);

                    if (!session.hide) {
                        group.hide = false;
                        day.shownSessions++;
                    }
                });
            });
            return day;
        });
    }

    filterSession(session: any, queryWords: string[], excludeTracks: any[], segment: string) {

        let matchesQueryText = false;
        if (queryWords.length) {
            queryWords.forEach((queryWords: string) => {
                if (session.name.toLowerCase().indexOf(queryWords) > -1) {
                    matchesQueryText = true;
                }
            });
        } else {
            matchesQueryText = true;
        }

        let matchesTracks = false;
        session.tracks.forEach((trackName: string) => {
            if (excludeTracks.indexOf(trackName) === -1) {
                matchesTracks = true;
            }
        });

        let matchesSegment = false;
        if (segment === 'favorites') {
            if (this.user.hasFavorite(session.name)) {
                matchesSegment = true;
            }
        } else {
            matchesSegment = true;
        }
        session.hide = !(matchesQueryText && matchesSegment && matchesSegment);
    }

    getSpeakers() {
        return this.load().map((data: any) => {
            return data.speakers.sort((a: any, b: any) => {
                let aName = a.name.split(' ').pop();
                let bName = b.name.split(' ').pop();
                return aName.localeCompare(bName);
            });
        });
    }

    getTracks() {
        return this.load().map((data: any) => {
            return data.tracks.sort();
        });
    }

    getMap() {
        return this.load().map((data: any) => {
            return data.map;
        });
    }





}