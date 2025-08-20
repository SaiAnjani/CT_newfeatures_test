// MySpace Tab Injection Script
// This script adds the MySpace tab to the existing Cleartrip navigation

(function() {
    'use strict';
    
    // Wait for the page to load
    function addMySpaceTab() {
        // Find the navigation container
        const navContainer = document.querySelector('.gAtpCm');
        
        if (navContainer) {
            // Create MySpace tab element
            const myspaceTab = document.createElement('div');
            myspaceTab.className = 'sc-gmgFlS';
            myspaceTab.innerHTML = `
                <div display="flex" cursor="pointer" height="64px" class="sc-gmgFlS cCghMI" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 8px 16px; margin-left: 8px;">
                    <div class="sc-gmgFlS jCHCQM">
                        <div class="sc-gmgFlS">
                            <div style="width: 20px; height: 20px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; margin-right: 8px;">AI</div>
                            <p color="#FFFFFF" cursor="pointer" text-decoration="none" font-size="14px" font-style="none" font-weight="600" class="sc-kMkxaj hALOkO" style="color: white;">MySpace</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Add click event to navigate to myspace.html
            myspaceTab.addEventListener('click', function() {
                window.location.href = 'myspace.html';
            });
            
            // Add hover effect
            myspaceTab.addEventListener('mouseenter', function() {
                this.querySelector('.cCghMI').style.background = 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)';
            });
            
            myspaceTab.addEventListener('mouseleave', function() {
                this.querySelector('.cCghMI').style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            });
            
            // Insert the MySpace tab into the navigation
            navContainer.appendChild(myspaceTab);
        } else {
            // If the specific class is not found, try alternative selectors
            const alternativeNav = document.querySelector('[class*="nav"]') || 
                                 document.querySelector('[class*="tabs"]') ||
                                 document.querySelector('nav');
            
            if (alternativeNav) {
                const myspaceTab = document.createElement('a');
                myspaceTab.href = 'myspace.html';
                myspaceTab.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                    margin-left: 8px;
                    transition: background 0.2s ease;
                `;
                myspaceTab.innerHTML = `
                    <div style="width: 20px; height: 20px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">AI</div>
                    MySpace
                `;
                
                myspaceTab.addEventListener('mouseenter', function() {
                    this.style.background = 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)';
                });
                
                myspaceTab.addEventListener('mouseleave', function() {
                    this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                });
                
                alternativeNav.appendChild(myspaceTab);
            }
        }
    }
    
    // Try to add the tab when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addMySpaceTab);
    } else {
        addMySpaceTab();
    }
    
    // Also try after a short delay to ensure all elements are loaded
    setTimeout(addMySpaceTab, 1000);
    
})(); 