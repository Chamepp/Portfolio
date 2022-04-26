document.body.addEventListener("mousemove", evt => {
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;
    
    gsap.set(".cursor", {
      x: mouseX,
      y: mouseY
    })
    
    gsap.to(".shape", {
      x: mouseX,
      y: mouseY,
      stagger: -0.1
    })
  })
  