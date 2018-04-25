<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
 xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
 xmlns="http://www.opengis.net/sld"
 xmlns:ogc="http://www.opengis.net/ogc"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- a Named Layer is the basic building block of an SLD document -->
  <NamedLayer>
    <Name>default_raster</Name>
    <UserStyle>
    <!-- Styles can have names, titles and abstracts -->
      <Title>Default Raster</Title>
      <Abstract>A sample style that draws a raster, good for displaying imagery</Abstract>
      <!-- FeatureTypeStyles describe how to render different features -->
      <!-- A FeatureTypeStyle for rendering rasters -->
      <FeatureTypeStyle>
        <Rule>
          <Name>rule1</Name>
          <Title>Opaque Raster</Title>
          <Abstract>A raster with 100% opacity</Abstract>
          <RasterSymbolizer>
            <ColorMap>
              <ColorMapEntry color="#000810" quantity="0" opacity=".7" />
              <ColorMapEntry color="#889098" quantity="25" opacity=".85" />
              <ColorMapEntry color="#f8FFfe" quantity="65" opacity="1" />
              <ColorMapEntry color="#ffFFff" quantity="254" opacity="1" />
              <ColorMapEntry color="#FFFFFF" quantity="255" opacity="0" />
            </ColorMap>

          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
