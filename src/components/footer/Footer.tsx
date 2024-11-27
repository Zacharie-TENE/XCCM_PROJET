import React from "react";
import "./Footer.css";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram , FaLinkedin, FaRegCopyright } from "react-icons/fa6";

export const Footer = () => {
    return (
        
        <div className="footer" >    
            <div className="footer-content">
                <div className="connect" id="Footer">
                <Image className="pl-16" src='/images/logo.png' height={16} width={32} alt='logo' />
                    <div className="copyright">
                        <FaRegCopyright />
                        <p>2024 XCCM.<br/>All rights reserved</p>
                    </div>
                </div>
                <div className="A_propos" id="Footer">
                    <p className="text_a_propos">About</p>
                    <div className="a_propos-content">
                        <p>XCCM helps you create useful content</p>
                    </div>
                </div>

                <div className="Aide" id="Footer">
                    <p className="text_aide">Help</p>
                    <div className="aide-content">
                        <p>Do you have any questions? </p>
                    </div>
                </div>

                <div className="ContactUs" id="Footer">
                    <p className="contactname">Contact us</p>
                    <div className="contact12">
                        <FaWhatsapp/>
                        <p>+237____________</p>
                    </div>
                    <div className="contact12">
                        <FaWhatsapp/>
                        <p>+237____________</p>
                    </div>
                    <p>ENSPY </p>
                    <p>Yaoundé Cmr</p>
                </div>

                <div className="social_Media_Icons">
                <FaXTwitter to="https://twitter.com/i/flow/login" />
                {/* <a href="https://web.facebook.com/?_rdc=1&_rdr" target="_blank"><FaFacebookF/> </a> */}
                <FaFacebookF/>
                <FaInstagram />
                <FaLinkedin />
            </div>

             </div>

            
        </div>
        
    );
};

export default Footer
