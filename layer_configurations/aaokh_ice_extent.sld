<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>AaokhSeaIceExtent</se:Name>
    <UserStyle>
      <se:Name>AaokhSeaIceExtent</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Marginal Ice Zone</se:Name>
          <se:Description>
            <se:Title>Marginal Ice Zone</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ICECODE</ogc:PropertyName>
              <ogc:Literal>CT18</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#236192</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.7</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000001</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:TextSymbolizer>
           <se:Label>
             <ogc:PropertyName>Ice</ogc:PropertyName>
           </se:Label>
           <se:Halo>
             <se:Radius>3</se:Radius>
             <se:Fill>
               <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
             </se:Fill>
           </se:Halo>
         </se:TextSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Fast Ice</se:Name>
          <se:Description>
            <se:Title>Fast Ice</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ICECODE</ogc:PropertyName>
              <ogc:Literal>CT81</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.4</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000001</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:TextSymbolizer>
           <se:Label>
             <ogc:PropertyName>Ice</ogc:PropertyName>
           </se:Label>
           <se:Halo>
             <se:Radius>3</se:Radius>
             <se:Fill>
               <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
             </se:Fill>
           </se:Halo>
         </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
