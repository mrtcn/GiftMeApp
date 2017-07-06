export class EventViewModel {
    constructor(
        public id: number,
        public eventDate: string,
        public eventName: string,
        public eventImagePath: string,
        public userId: number,
        public eventTypeId: number,
        public permission: number,
        public eventOwner: User,
        public users: Array<User>,
        public giftItemList: Array<GiftItemList>
    ) { }
}

export class CreateEventModel {
    constructor(
        public eventDate: string,
        public eventName: string,
        public eventImagePath: string,
        public permission: number
    ) { }
}

export class HomeEventListViewModel {
    constructor(
        public id: number,
        public eventDate: string,
        public eventName: string,
        public eventImagePath: string,
        public eventTypeId: number,
        public eventOwner: User
    ) { }
}

export class User {
    constructor(
        public userId: number,
        public fullName: string,
        public userImagePath: string
    ) { }
}

export class GiftItemList {
    constructor(
        public id: number,
        public eventId: number,
        public giftItemName: string,
        public giftImagePath: string,
        public isBought: boolean,
        public userId: number
    ) { }
}

export class EventListType{
    constructor(public eventListType: number) { }
}

export class EventIdModel {
    constructor(public eventId: number) { }
}