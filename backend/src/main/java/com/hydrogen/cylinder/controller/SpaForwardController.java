package com.hydrogen.cylinder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
        "/",
        "/home",
        "/dashboard",
        "/calculator",
        "/materials",
        "/comparison",
        "/recommendation",
        "/sensitivity",
        "/history",
        "/about",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/profile",
        "/admin"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
