var canvas = null;
var ctx = null;
var origin = null;
var scene = [];
var one = 250;

var unit_circle = {
    r: one,
    hidden: false,
    x: 0,
    y: 0,
    render: function() {
        if (this.hidden) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(this.r, this.y);
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
        ctx.stroke();
    }
};

var vector2d = function(magnitude, direction) {
    return { m: magnitude, d: direction }
};

var next_val = function(current, final, duration) {
    if (current == final) {
        return final;
    }
    var step = (final - current) / (duration * 5);
    return current + step;
};

var pie_slice = function(v_f,r,t,o) {
    return {
        m_0: 0,
        m_f: v_f.m,
        d_0: v_f.d,
        d_f: v_f.d,
        r_0: r,
        r_f: r,
        t_0: t,
        t_f: t,
        o_0: o,
        o_f: o,
        render: function() {
            ctx.save();
            this.m_0 = next_val(this.m_0, this.m_f, 2);
            this.d_0 = next_val(this.d_0, this.d_f, 2);
            this.r_0 = next_val(this.r_0, this.r_f, 2);
            this.t_0 = next_val(this.t_0, this.t_f, 2);
            this.o_0 = next_val(this.o_0, this.o_f, 4);
            ctx.rotate(this.d_0);
            ctx.translate(this.m_0,0);
            ctx.rotate(-this.t_0 / 2);
            ctx.rotate(this.o_0);
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(this.r_0,0);
            ctx.arc(0,0,this.r_0,0,this.t_0);
            ctx.lineTo(0,0);
            ctx.stroke();
            ctx.restore();
        },
        move: function(m, d, r, t, o) {
            this.m_f = m != null ? m : this.m_0;
            this.d_f = d != null ? d : this.d_0;
            this.r_f = r != null ? r : this.r_0;
            this.t_f = t != null ? t : this.t_0;
            this.o_f = o != null ? o : this.o_0;
        }
    }
}

var start_pi = function() {
   canvas = document.getElementById("canvas");
   origin = {
       x: canvas.width / 2,
       y: canvas.height / 2
   }
   ctx = canvas.getContext('2d');
   ctx.translate(canvas.width / 2, canvas.height / 2);
   ctx.transform(1, 0, 0, -1, 0, 0);
   window.requestAnimationFrame(render_scene);
};

var pause = false;
var render_scene = function() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    if (!pause) {
        for (var i = 0; i < scene.length; i++) {
            scene[i].render();
        }
        window.requestAnimationFrame(render_scene);
    }
};

var drawUnitCircle = function() {
    scene.push(unit_circle);
}

var slices = Array(16);
var drawCloseSlices = function() {
    unit_circle.hidden = true;
    theta = 2 * Math.PI / slices.length;
    for (i = 0; i < slices.length; i++) {
        v_0 = vector2d(0, theta * i - theta / 2);
        slices[i] = pie_slice(v_0, one, theta, 0);
    }
    scene = scene.concat(slices);
}

var explodeSlices = function() {
    for (i = 0; i < slices.length; i++) {
        slice = slices[i];
        slice.move(100, null, null, null, null);
    }
}

var implodeSlices = function() {
    for (i = 0; i < slices.length; i++) {
        slice = slices[i];
        slice.move(0, null, null, null, null);
    }
}

var moveSlices = function() {
    var C = 2 * one * Math.PI;
    var theta = 2 * Math.PI / slices.length;
    var x = 2 * one * Math.sin(theta / 2);
    var y = one * Math.cos(theta / 2);
    for (i = 0; i < slices.length / 4; i++) {
        slice = slices[i*2];
        c = (slices.length / 2 - 1) - (i * 2);
        var x1 = c*x/2 + x/4;
        var y1 = y/2;
        var alpha = Math.atan(y1/x1);
        slice.move(
            Math.sqrt(y1 * y1 + x1 * x1),
            Math.PI + alpha,
            null,
            null,
            -(alpha + Math.PI / 2)
        );
        slice = slices[i*2+1];
        x1 = (c-1)*x/2 + x/4;
        alpha = Math.atan(y1/x1);
        slice.move(
            Math.sqrt(y1 * y1 + x1 * x1),
            Math.PI - alpha,
            null,
            null,
            alpha + Math.PI / 2
        );
    }
    for (i = 0; i < slices.length / 4; i++) {
        slice = slices[slices.length/2+i*2];
        c = (slices.length / 2 - 1) - (i * 2);
        var x1 = c*x/2 + x/4;
        var y1 = y/2;
        var alpha = Math.atan(y1/x1);
        slice.move(
            Math.sqrt(y1 * y1 + x1 * x1),
            alpha,
            null,
            null,
            -(alpha + Math.PI / 2)
        );
        slice = slices[slices.length/2+i*2+1];
        x1 = (c-1)*x/2 + x/4;
        alpha = Math.atan(y1/x1);
        slice.move(
            Math.sqrt(y1 * y1 + x1 * x1),
            -alpha,
            null,
            null,
            alpha + Math.PI / 2
        );
    }
}

var setText = function(id, text, style, px) {
    e = document.getElementById(id);
    if (text != null) {
        e.innerHTML = text;
    }
    if (px != null) {
        e.style = style + ": " + px + "px";
    }
}

var setTop = function(text, bottom) {
    setText("top", text, "bottom", bottom);
}

var setCenter = function(text, bottom) {
    setText("center", text, "bottom", bottom);
}

var setBottom = function(text, bottom) {
    setText("bottom", text, "bottom", bottom);
}

var setBottomLeft = function(text, bottom) {
    setText("bottomleft", text, "bottom", bottom);
}

var proof = "";
var step = 0;
var steps = [
    drawUnitCircle,
    function() {
        setText("bottom", "c = circumference of the circle", "top", 3 * one);
    },
    function() {
        scene.push(
            {
                render: function() {
                    ctx.beginPath();
                    ctx.moveTo(-one, 0);
                    ctx.lineTo(one, 0);
                    ctx.stroke();
                }
            }
        );
    },
    function() {
        setCenter("d = diameter of the circle");
    },
    function() {
        setTop("π ≝ c / d", 3*one);        
    },
    function() {
        scene.pop();
        scene.push(
            {
                render: function() {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(-one * Math.cos(Math.PI/4*3), -one * Math.sin(Math.PI/4*3));
                    ctx.stroke();
                }
            }
        )
        setCenter("r = radius, or d / 2");
    },
    function() {
        scene.pop();
        setTop("");
        setCenter("A = π·r²");
        setBottom("");
    },
    function () {
        setCenter("");
        drawCloseSlices();
        explodeSlices();
    },
    implodeSlices,
    moveSlices,
    function() {
        scene = [];
        slices = Array(slices.length * 4);
        drawCloseSlices();
        explodeSlices();
    },
    moveSlices,
    function() {
        scene = [];
        slices = Array(slices.length * 8);
        drawCloseSlices();
        explodeSlices();
    },
    moveSlices,
    function() {
        setTop("w = c / 2", 2.5 * one);
    },
    function() {
        setText("left", "h = r", "top", 425);
    }
];

proof = [
    "A = w·h",
    "&nbsp;&nbsp;= (c/2)·(r)",
    "A = c·r/2",
    "π = c/d",
    "c = π·d",
    "&nbsp;&nbsp;= π(2·r)",
    "c = 2·π·r",
    "A = c·r/2",
    "&nbsp;&nbsp;= (2·π·r)·r/2",
    "&nbsp;&nbsp;= π·r·r",
    "A =  π·r²"
];

proof_steps = proof.map(
    function(step) {
        return function() {
            e = document.getElementById("bottomleft");
            e.innerHTML = e.innerHTML + "<br/>" + step;
        }
    }
);

steps = steps.concat(proof_steps);

steps.push(
    function() {
        setTop("");
        setText("left", "", "top", 425);
        setBottomLeft("")
        scene = [];
        unit_circle.hidden = false;
        scene.push(unit_circle);
        setCenter("A = π·r²");
    }
);

var next = function() {
    if (step < steps.length) {
        nextStep = steps[step++];
        nextStep();
    }
}