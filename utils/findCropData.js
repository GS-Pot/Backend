const coordinates = require("../data/location.json");
const data = require("../data/dataset.json");

async function findClosestCoordinates(targetLat, targetLng) {
  let closestCoordinates;
  let closestDistance = Infinity;
  // console.log(coordinates);
  for (let i = 0; i < coordinates.length; i++) {
    // console.log(coordinates[i].Latitude);
    const currentLat = coordinates[i].Latitude;
    const currentLng = coordinates[i].Longitude;
    // console.log(currentLng);
    // var currentLocation = coordinates[i];
    const currentDistance = await getDistanceBetweenCoordinates(
      targetLat,
      targetLng,
      currentLat,
      currentLng
    );

    if (currentDistance < closestDistance) {
      closestDistance = currentDistance;
      closestCoordinates = [currentLat, currentLng];
      //   currentLocation = coordinates[i];
    }
  }
  //   console.log(closestCoordinates);
  return closestCoordinates;
}

async function getDistanceBetweenCoordinates(lat1, lng1, lat2, lng2) {
  const radius = 6371e3; // Earth's radius in meters
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const latDiff = toRadians(lat2 - lat1);
  const lngDiff = toRadians(lng2 - lng1);

  //   console.log(lat1Rad, lat2Rad, latDiff, lngDiff);
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);
  //   console.log(a);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   console.log(radius);
  //   console.log(a, Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  return radius * c;
}

function toRadians(deg) {
  return deg * (Math.PI / 180);
}

async function getLocation(lat, long) {
  //   console.log(data);
  console.log(lat, long, typeof lat, typeof long);
  coords = await findClosestCoordinates(lat, long);
  if (coords) {
    return coordinates.find(
      (item) => item.Latitude === coords[0] && item.Longitude === coords[1]
    );
  } else {
    return [0, 0];
  }
  //   return [10, 20.0];
}

module.exports = { getLocation };
