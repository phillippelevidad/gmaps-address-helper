# GMaps Address Helper
A JS class to facilitate extracting address info (street, city, etc) from the GMaps Places Autocomplete.

## How to use
Listen to the `place_changed` event from the Places Autocomplete and pass it to the `GMapsAddressHelper` like so:

```javascript
var place = autocomplete.getPlace();
var helper = new GMapsAddressHelper(place);
var addressInfo = helper.extractParts();
```

You'll be returned an object like this:

```javascript
{
    address: { found: true, longName: '', shortName: '' },
    route: { found: true, longName: '', shortName: '' },
    streetNumber: { found: true, longName: '', shortName: '' },
    neighborhood: { found: true, longName: '', shortName: '' },
    city: { found: true, longName: '', shortName: '' },
    state: { found: true, longName: '', shortName: '' },
    country: { found: true, longName: '', shortName: '' },
    zipCode: { found: true, longName: '', shortName: '' },
}
```

You can set a new place to extract info from by using the method:

```javascript
helper.setPlace(newPlace);
```
