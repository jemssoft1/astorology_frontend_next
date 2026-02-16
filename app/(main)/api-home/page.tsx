"use client";

import Link from "next/link";

export default function APIHomePage() {
  return (
    <div
      className="min-vh-100 container-fluid pt-4 text-center"
      style={{
        backgroundColor: "#3a4764",
        color: "aliceblue",
        marginBottom: "150px",
      }}
    >
      <style jsx>{`
        h2,
        h5 {
          color: aliceblue;
        }
        a {
          color: #8fcdff;
          text-decoration: none;
          font-size: 19px;
        }
        a:hover {
          color: #f00;
        }
      `}</style>

      <div style={{ textAlign: "center" }}>
        <pre
          style={{ color: "aliceblue", lineHeight: "1.15", overflowX: "auto" }}
        >
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

        <h2 className="mt-4">🙏 Welcome Developer 🙏</h2>
        <h5>To The Best Vedic Astrology API On Earth</h5>
        <hr />

        <div
          className="vstack gap-2"
          style={{ maxWidth: "400px", margin: "0 auto", fontSize: "19px" }}
        >
          <Link
            href="/api-builder"
            target="_blank"
            className="text-decoration-none"
          >
            EASY API BUILDER
          </Link>
          <a
            href="https://www.youtube.com/@astroweb/videos"
            target="_blank"
            className="text-decoration-none"
            rel="noopener noreferrer"
          >
            YOUTUBE GUIDE
          </a>
          <a
            href="https://github.com/astroweb/astroweb"
            target="_blank"
            className="text-decoration-none"
            rel="noopener noreferrer"
          >
            SOURCE CODE
          </a>
          <Link href="/about" target="_blank" className="text-decoration-none">
            ABOUT
          </Link>
          <Link
            href="/donate"
            style={{ color: "red" }}
            target="_blank"
            className="text-decoration-none"
          >
            FREE USE FOR ALL
          </Link>
        </div>
      </div>

      <footer className="align-items-center py-3 my-4 border-top vstack gap-1">
        <span className="text-muted">
          <small>
            <Link href="/donate" target="_blank">
              Support
            </Link>{" "}
            ❤ <Link href="/">astroweb</Link>
          </small>
        </span>
      </footer>
    </div>
  );
}
