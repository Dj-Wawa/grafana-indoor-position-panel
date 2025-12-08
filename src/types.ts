export interface SimpleOptions {
  imageUrl: string
  coordinates: {
    topLeft: {
      lat: number
      long: number
    }
    bottomLeft: {
      lat: number
      long: number
    }
    topRight: {
      lat: number
      long: number
    }
  }
  minElevation: number
  maxElevation: number
  destination: {
    lat: number
    long: number
    elevation: number
  }
}
