export class ItemViewModel {
    constructor(
        public id: number,
        public itemName: string,
        public itemImagePath: string,
        public brand: string,
        public description: string,
        public amount: number,
        public userId: number,
        public isBought: boolean,
        public giftStatus: number,
        public itemOwner: User
    ) { }
}

export class CreateUpdateItemModel {
    constructor(
        public id: number,
        public eventId: number,
        public itemName: string,
        public itemImagePath: string,
        public brand: string,
        public description: string,
        public amount: number,
        public userId: number
    ) { }
}

export class User {
    constructor(
        public userId: number,
        public fullName: string,
        public userImagePath: string
    ) { }
}

export class ItemListType{
    constructor(public itemListType: number) { }
}

export class ItemIdModel {
    constructor(public itemId: number) { }
}

export class EventIdModel {
    constructor(public eventId: number) { }
}

export class GiftItemTabNavParams {
    constructor(
        public eventId: number,
        public itemTypeId: number) { }
}

export class GiftItemCreateUpdateNavParams {
    constructor(
        public eventId: number,
        public giftItemId: number) { }
}

export class ToggleBuyStatusModel {
    constructor(
        public id: number,
        public isBought: boolean) { }
}