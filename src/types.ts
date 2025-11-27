export interface SimpleOptions {
  imageUrl: string
  coordinates:{
    topLeft:{
      lat: number
      long: number
    }
    bottomLeft:{
      lat: number
      long: number
    }
    topRight:{
      lat: number
      long: number
    }
  }
  /*topLeftLat: number
  topLeftLong: number
  topRightLat: number
  topRightLong: number
  bottomRightLat: number
  bottomRightLong: number*/
  minElevation: number
  maxElevation: number
  destination:{
    lat: number
    long: number
    elevation: number
  }
  /*destLat: number
  destLong: number
  destElevation: number*/
}
