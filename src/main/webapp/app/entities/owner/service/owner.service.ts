import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOwner, getOwnerIdentifier } from '../owner.model';

export type EntityResponseType = HttpResponse<IOwner>;
export type EntityArrayResponseType = HttpResponse<IOwner[]>;

@Injectable({ providedIn: 'root' })
export class OwnerService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/owners');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(owner: IOwner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(owner);
    return this.http
      .post<IOwner>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(owner: IOwner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(owner);
    return this.http
      .put<IOwner>(`${this.resourceUrl}/${getOwnerIdentifier(owner) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(owner: IOwner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(owner);
    return this.http
      .patch<IOwner>(`${this.resourceUrl}/${getOwnerIdentifier(owner) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOwner>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOwner[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getAll(): any {
    return this.http.get<IOwner[]>(this.resourceUrl);
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOwnerToCollectionIfMissing(ownerCollection: IOwner[], ...ownersToCheck: (IOwner | null | undefined)[]): IOwner[] {
    const owners: IOwner[] = ownersToCheck.filter(isPresent);
    if (owners.length > 0) {
      const ownerCollectionIdentifiers = ownerCollection.map(ownerItem => getOwnerIdentifier(ownerItem)!);
      const ownersToAdd = owners.filter(ownerItem => {
        const ownerIdentifier = getOwnerIdentifier(ownerItem);
        if (ownerIdentifier == null || ownerCollectionIdentifiers.includes(ownerIdentifier)) {
          return false;
        }
        ownerCollectionIdentifiers.push(ownerIdentifier);
        return true;
      });
      return [...ownersToAdd, ...ownerCollection];
    }
    return ownerCollection;
  }

  protected convertDateFromClient(owner: IOwner): IOwner {
    return Object.assign({}, owner, {
      dateOfBirt: owner.dateOfBirt?.isValid() ? owner.dateOfBirt.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateOfBirt = res.body.dateOfBirt ? dayjs(res.body.dateOfBirt) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((owner: IOwner) => {
        owner.dateOfBirt = owner.dateOfBirt ? dayjs(owner.dateOfBirt) : undefined;
      });
    }
    return res;
  }
}
