export class NotificationViewModel {
  constructor(
    public userId: number,
    public entityId: number,
    public notificationStatus: NotificationStatusType,
    public notificationTitle: string,
    public notificationDescription: string,    
    public isDisplayed: boolean
  ) { }
}

export enum NotificationStatusType {
  GiftAcquired = 1,
  GiftAcquiredInFavoritedWishlist = 2,
  GiftAdded = 3
}
