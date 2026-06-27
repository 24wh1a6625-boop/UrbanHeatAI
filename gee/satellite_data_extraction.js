// ===============================
// UrbanHeatAI
// Satellite Data Extraction
// Hyderabad Study Area
// ===============================


// 1. Define study area

var studyArea = ee.Geometry.Rectangle([
  78.35,
  17.30,
  78.60,
  17.50
]);

Map.centerObject(studyArea,10);


// 2. Landsat 9 Thermal Data

var landsat = ee.ImageCollection(
  "LANDSAT/LC09/C02/T1_L2"
)
.filterBounds(studyArea)
.filterDate(
  '2025-03-01',
  '2025-05-31'
)
.filter(
  ee.Filter.lt(
    'CLOUD_COVER',
    20
  )
);


print(
  "Landsat Images:",
  landsat.size()
);


// Select image

var image = landsat.first();


// True color image

Map.addLayer(
 image,
 {
 bands:['SR_B4','SR_B3','SR_B2'],
 min:0,
 max:30000
 },
 'Satellite Image'
);


// Temperature conversion

var temperatureC = image
.select('ST_B10')
.multiply(0.00341802)
.add(149.0)
.subtract(273.15);


Map.addLayer(
 temperatureC,
 {
 min:25,
 max:50,
 palette:[
 'blue',
 'cyan',
 'green',
 'yellow',
 'orange',
 'red'
 ]
 },
 'Land Surface Temperature'
);



// 3. Sentinel-2 Vegetation Data


var sentinel = ee.ImageCollection(
"COPERNICUS/S2_SR_HARMONIZED"
)
.filterBounds(studyArea)
.filterDate(
'2025-03-01',
'2025-05-31'
)
.filter(
ee.Filter.lt(
'CLOUDY_PIXEL_PERCENTAGE',
20
)
);


print(
"Sentinel Images:",
sentinel.size()
);


// Composite

var s2Image = sentinel.median();


// NDVI

var ndvi = s2Image
.normalizedDifference(
['B8','B4']
)
.rename('NDVI');


Map.addLayer(
ndvi,
{
min:0,
max:1,
palette:[
'brown',
'yellow',
'green'
]
},
'NDVI'
);