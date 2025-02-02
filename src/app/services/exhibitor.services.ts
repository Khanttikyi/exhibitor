import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExhibitorService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCountries(): Observable<any> {
        return this.http.get(`${this.apiUrl}/exhibitor-company-list`);
    }
    getCountriesJson(): Observable<any> {
        return this.http.get(`${environment.countryJsonUrl}`);
    }

    registerExhibitor(exhibitorData: any): Observable<any> {
        const exhibitorValues = this.mapFormDataToApi(exhibitorData);
        console.log(exhibitorValues);
        const requests = exhibitorValues.exhibitors.map((exhibitor: any, index: number) => {
            if (index % 2 !== 0) {
                return new Observable(observer => {
                    setTimeout(() => {
                        observer.error({
                            success: false,
                            message: `Error registering exhibitor`,
                            error: { message: 'Simulated error for odd index' }
                        });
                    }, 2000);
                });
            } else {
                return of({
                    success: true,
                    message: 'Exhibitor registered successfully',
                    exhibitors: exhibitorValues.exhibitors
                });
            }
        });
    
        return new Observable(observer => {
            let completed = 0;
            const total = requests.length;
            const errors: any[] = [];
    
            requests.reduce((promise: any, request: any, index: number) => {
                return promise.then(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            request.toPromise().then((response: any) => {
                                completed++;
                                const progress = (completed / total) * 100;
                                observer.next({
                                    progress: progress,
                                    currentExhibitor: completed,
                                    totalExhibitors: total,
                                    response: response
                                });
    
                                if (completed === total) {
                                    observer.complete();
                                }
                                resolve(response);
                            }).catch((error: any) => {
                                errors.push({ index, error });
                              
                                    observer.error({ errors });
                                
                                reject(error);
                            });
                        }, 3000); // 5-second delay
                    });
                });
            }, Promise.resolve());
        });
    }
    testRegisterExhibitor(exhibitorData: any) {
        const exhibitorValues = this.mapFormDataToApi(exhibitorData);
        console.log(exhibitorValues);
        return of(exhibitorValues);
    }
    mapFormDataToApi(formData: any): any {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters = Array(5)
            .fill(null)
            .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
            .join('');
        return {
            exhibitors: formData.exhibitors.map((exhibitor: any) => ({
                "S_added_via": "Web Form",
                "S_company": formData.company,
                "S_email_address": exhibitor.email,
                "S_group_reg_id": randomLetters,
                "S_name_on_badge": exhibitor.nameOnBadge,
                "S_job_title": exhibitor.jobTitle,
                "S_country": exhibitor.country,
                "S_company_on_badge": exhibitor.companyOnBadge,
                "SB_event_fha": formData.event === "FHA-Food & Beverage" ? true : false,
                "SB_event_prowine": formData.event === "Prowine Singapore" ? true : false

            }))
        };
    }
}
