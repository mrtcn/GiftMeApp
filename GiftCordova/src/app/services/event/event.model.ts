export class EventViewModel {
    constructor(
        public id: number,
        public eventDate: string,
        public eventName: string,
        public eventImagePath: string,
        public isFavoriteEvent: boolean,
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
        public id: number,
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
        public eventBoughtItemAmount: number,
        public eventLeftItemAmount: number,
        public eventItemAmount: number,
        public eventImagePath: string,
        public eventThumbnailPath: string,
        public eventTypeId: number,
        public eventOwner: User
    ) { }
}

export class User {
    constructor(
        public userId: number,
        public userName: string,
        public userImagePath: string,
        public userThumbnailPath: string,
    ) { }
}

export class GiftItemList {
    constructor(
        public id: number,
        public eventId: number,
        public giftItemName: string,
        public giftImagePath: string,
        public brand: string,
        public description: string,
        public amount: number,
        public isBought: boolean,
        public userId: number
    ) { }
}

export class EventListType{
    constructor(public eventListType: number) { }
}

export class SearchEventListModel {
    constructor(
        public eventListType: number,
        public searchTerm: string
    ) { }
}

export class EventIdModel {
    constructor(public eventId: number) { }
}
