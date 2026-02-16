"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { astroweb } from "@/lib/astroweb"; // Import for API domain if needed

export default function APIBuilder() {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    // Fetch the API content that was originally in data/APIHomePage.html
    // For now, I'll hardcode the structure or fetch it if it was a static HTML file.
    // But better is to just reproduce the content in React.
    // However, the legacy app used APIHomePage.html.
    // I will implement the "Easy API Builder" UI here.
    // It seems the legacy page just listed links?
    // Wait, APIBuilder.html had: <div id="ApiMethodViewer" ...></div>
    // And JS: new ApiMethodViewer...
    // So I need to know what ApiMethodViewer does.
    // It likely fetches the list of API methods and displays them.
    // Since I don't have the ApiMethodViewer code yet (grep running),
    // I will put a placeholder or basic text.
  }, []);

  return (
    <div className="container">
      <PageHeader
        title="API Builder"
        description="Astro data via a simple HTTP request. Enabling you to build your app or service faster and cheaper. 🙏 Donated by Leslie C."
        imageSrc="/images/api-builder-banner.png"
      />

      <div className="alert alert-info">
        This page is under construction. The API Builder functionality is being
        ported.
      </div>

      <div className="text-center">
        <pre style={{ color: "black", lineHeight: 1.15, overflowX: "auto" }}>
          {`
                                          ...::^^^^^^::...                                          
                                  .:~7JY?!7???77!?P!77?JJ?77YJ7~:.                                  
                             .~??YJ~^~:.: .      .7      ....:~!~J5J7~.                             
                         .~JJ??^    ^:^.^:..  ...^J.... .:^:.^~: ...:?JJJ~.                         
                      :7JY!~~       ..:::. ......^?......  ::::..:     .J!557.                      
                   .7Y?!.   .:  ..^:             .!           . .::.. .~   .!Y5!.                   
                 ^JJ~.       ~!:     .^:~ :^:^   .~    :^   ^:      .~7:      .!PJ:                 
               ~Y?:...:. ....  :.    ^: :^~  !   .~     ~7~7:       :.  .:. ...  ^Y5^               
             ^Y7:..:......      :.       5:      .~    .!   !      :.      .:..... :Y5:             
           .YJ:......::          ..      !.      .^     .^:^.     ^          .:..::  ^PJ            
          !5~.  .  :.   ^.  ::    .:             .~             .:    ^^.:^:   .: .:   ?G^          
         YJ^     ..     :7..!.      :    ..  ....:~..... ..    ..      ! :7      ..     ^B?         
       .P!....  :.      .!..~.       ^: .         ^        . .^.       !.:7        :.  . .5Y        
      .P^.    .~..      :.  ..    ... ..   .. .  .:  ...     :  ..    :...:.      . ^^     Y5       
      G~. ..  :     .           ..     ..  .  .   :   ..   ..     ..           ..    ..    .5Y      
     5!.  .  :        ..      ..    ..   .   ..   .  .    ..  . .   ..     ...        .  ..  P7     
    ~5: ..  :              ....    ..:   .:.             ..   ...     :..              :  .  :B.    
    B.. .. .                .   .      ..                  ..  .    .  ..     .:.....   . ..  75    
   ~Y.  .  .   ........    .      .  ..      :  ^. ^  .       .  .      .    .:.: ..:.  .. .  :B.   
   P^. .  ..   ........   .   ..    .      . .:.:.....: ..     .     .   .   .:.  :.:.   : ..  5?   
   G.  .  .               .   ...  .       .:..      ....       .         .     ...      .     !G   
  .P                                       ..          ..                 .                    .B   
  :P   .^^:       ^^:              .    ?J^ .    ~!~    ..       .  ...   .                    .G   
  :P   .&@&      P@@:                  .@@5..   Y@@@5  ...          B@#   .                    .B   
  .G    .@@G    ?@@7  :7YP5!.    .!5PY~.@@Y  . !@@!@@7   . ~J55Y7..Y@@@Y? .?Y^.75^  :?5PY?:    :B   
   B.    ^@@?  .@@Y !&@B?7J&@B: J@@&PYG&@@J   :@@? 7@@^   &@#!!5#! 5@@@Y?. @@&&&G^~#@&5YG@@B.  !5   
   Y!     7@@: &@B  @@@5YY5G@@G.@@G    :@@?   #@@77!&@&.  G@&G57^   #@#    &@&:. .&@#    :@@G  5~   
   .G      5@&G@&.  &@@J^^^7Y7:.@@#.   ~@@J  P@@PPGPP@@G  ..^!Y&@#  #@&    &@B  . #@&.   ~@@5 .B    
    5~      B@@@.   .5&&GPG&&7  :#@@#B##&@&.?@@~     ~@@?^&&GY5&@P  P@@&&7 &@#    .P@@#B&@@Y  Y7    
    .B       ~^.       :~~^.      .!77:  !~ :^^       :^^ .^~77!.    ^!!^. ^~:       ^77!:   ^G     
     ~5                                                                                     .G.     
      7Y                                                                                    P^      
       ?J                                                                                 .P^       
        !5                               ?!       ~J77?7?7.   .!                         :P:        
         :P:                            P#&!      G&.....~B5  !@.                       !5.         
           J?                          Y# :&^     G#      .@~ !@                      .Y7           
            ^Y~                       7&   ~&.    G&      5&. !@                     7Y.            
              !J^                    ^@P!?77&&    P@JYYY55?.  7@                   !Y^              
                ~J~                 :@7.:::::G#   G&          !@                .!J^                
                  ^?7:             .&J        BG  G#          !@.             ^??:                  
                    .!?!:          .:          :  ..           :           :7?~                     
                       .~7!^.                                          .~77^.                       
                           :!7!^:.                                .:~!7~:                           
                               .^~!!~^:...                ..::^!!!~:.                               
                                     .:^~~~!!!!~~~~~~!!!!~~^^..                                     
`}
        </pre>
        <h2>🙏 Welcome Developer 🙏</h2>
        <h5>To The Best Vedic Astrology API On Earth</h5>
        <hr />
        <div className="vstack gap-2">
          <a target="_blank" href="https://astroweb.in/APIBuilder.html">
            EASY API BUILDER
          </a>
          <a target="_blank" href="https://www.youtube.com/@astroweb/videos">
            YOUTUBE GUIDE
          </a>
          <a target="_blank" href="https://github.com/astroweb/astroweb">
            SOURCE CODE
          </a>
          <a target="_blank" href="https://astroweb.in/About.html">
            ABOUT
          </a>
          <a
            target="_blank"
            style={{ color: "red" }}
            href="https://astroweb.in/Donate.html"
          >
            FREE USE FOR ALL
          </a>
        </div>
      </div>
    </div>
  );
}
