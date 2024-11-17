package com.amadeus.extraours.security;


import com.amadeus.extraours.exception.InvalidVerificationCodeException;
import com.amadeus.extraours.exception.UserLockedException;
import com.amadeus.extraours.service.AuthenticationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class VerificationCodeAuthFilter extends OncePerRequestFilter {

    private final AuthenticationService authenticationService;

    public VerificationCodeAuthFilter(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String email = request.getParameter("email");
        String verificationCode = request.getParameter("verificationCode");

        if (email != null && verificationCode != null) {
            try {
                authenticationService.verifyCode(email, verificationCode);
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(email, null, null));
            } catch (InvalidVerificationCodeException | UserLockedException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write(e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }


}
