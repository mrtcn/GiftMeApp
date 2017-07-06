export class ItemViewModel {
    constructor(
        public id: number,
        public itemName: string,
        public itemImagePath: string,
        public userId: number,
        public isBought: boolean,
        public itemOwner: User
    ) { }
}

export class CreateUpdateItemModel {
    constructor(
        public id: number,
        public eventId: number,
        public itemName: string,
        public itemImagePath: string,
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

export class GiftItemCreateUpdateNavParams {
    constructor(
        public eventId: number,
        public giftItemId: number) { }
}