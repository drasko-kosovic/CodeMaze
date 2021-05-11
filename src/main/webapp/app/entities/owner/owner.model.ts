import * as dayjs from 'dayjs';

export interface IOwner {
  id?: number;
  name?: string | null;
  dateOfBirt?: dayjs.Dayjs | null;
  address?: string | null;
}

export class Owner implements IOwner {
  constructor(public id?: number, public name?: string | null, public dateOfBirt?: dayjs.Dayjs | null, public address?: string | null) {}
}

export function getOwnerIdentifier(owner: IOwner): number | undefined {
  return owner.id;
}
