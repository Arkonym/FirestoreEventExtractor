/**
* These are unneeded if you are using the Firebase admin SDK, as event data is accessed simply through change.data() or change.after.data();
* If you are using the native Firestore triggers in the Google Cloud Console, using the below function will simplify data reference.
* Does not currently support GeoP
**/

/**
 * Takes in a Firestore Event's snapshot - this can be event.value, event.oldValue, or event.updateMask
 * Returns a plain Javascript object with the corresponding fields and values
 * @param {Event.Value} recordValue
 * @return {Object}
 */
exports.extractData = (snapValue)=>{
  const data = {};
  if (snapValue.fields == null || snapValue.fields == undefined) {
    return {};
  }
  for (const [key, value] of Object.entries(snapValue.fields)) {
    data[key] = extractVal(value);
  }
  return data;
};

/**
 * Returns the normal Javascript value for a given Firestore 'Value'
 * https://cloud.google.com/firestore/docs/reference/rest/v1/Value#MapValue
 * @param {Value} field
 * @return {Any}
 */
const extractVal = (field)=>{
  if (field.nullValue) {
    return null;
  }
  if (field.booleanValue) {
    return field.booleanValue;
  }
  if (field.integerValue) {
    return field.integerValue;
  }
  if (field.doubleValue) {
    return field.doubleValue;
  }
  if (field.timestampValue) {
    return field.timestampValue;
  }
  if (field.stringValue) {
    return field.stringValue;
  }
  if (field.bytesValue) {
    return field.bytesValue;
  }
  if (field.referenceValue) {
    return field.referenceValue;
  }
  if (field.geoPointValue) {
    return field.geoPointValue;
  }
  // the above are simple values with direct returns. Arrays and maps must recurse
  if (field.arrayValue) {
    const arr = [];
    field.arrayValue.values.forEach((arrayVal)=>arr.push(extractVal(arrayVal))); // recurse on each element in the array
    return arr;
  }

  if (field.mapValue) {
    const data = {};
    for (const [key, value] of Object.entries(field.mapValue.fields)) { // recurse on each field in the map
      data[key] = extractVal(value);
    }
    return data;
  }
};
