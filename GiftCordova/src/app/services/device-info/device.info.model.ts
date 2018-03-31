
export class DeviceInfoModel {
  constructor(
    public userId: number,
    public registerationId: string,
    public mobilePlatformType: string,
    public version: string
  ) { }
}
