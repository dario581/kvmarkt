import { trigger, animate, transition, group, style, query, state, stagger } from '@angular/animations';
import { AnimationEntryMetadata } from '@angular/core';

export const fadeAnimation =
    trigger('routerTransition', [
        transition('* => *', [

            query(':enter, :leave',
                [
                    style({ position: 'absolute', width: '100%', opacity: 0.2 })
                ],
                { optional: true }
            ),

            group([  // block executes in parallel
                query(':leave', [
                    style({
                        opacity: 0.4,
                        zIndex: 0,
                        color: '#fff'
                    }),
                    animate('0.2s ease-out', style({
                        opacity: 0
                    }))
                ], { optional: true }),
                query(':enter', [
                    style({
                        opacity: 0.8,
                        zIndex: 5
                    }),
                    animate('0.2s ease-in', style({ opacity: 1 }))
                ], { optional: true }),
                query(':enter .animation-enter-children > *, :enter .animation-enter', [
                    style({ opacity: 0, transform: 'translateX(-30px)' }),
                    stagger(30, [
                        animate('0.4s 0.9s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
                    ])
                ], { optional: true }),
            ]),
            /* ,

           query(':leave',
               [
                   style({ opacity: 1 }),
                   animate('0.2s ease-in', style({ opacity: 0 }))
               ],
               { optional: true }
           ),

           query(':enter',
               [
                   style({ opacity: 1 }),
                   animate('0.4s ease-out', style({ opacity: 1 }))
               ],
               { optional: true }
           ) */

        ])
    ]
    );

export const slideTileAnimation = trigger('slideTileAnimation', [
    state('no', style({
        opacity: 0
    })),
    state('yes', style({
        opacity: 1
    })),
    /* transition('no => yes', [ // each time the binding value changes
        query('app-scheme-card', [
            // style({ opacity: 0 }),
            // stagger(80, [
            animate('1000ms ease-in', style({ opacity: 1 }))
            // ])
        ], { optional: true })
    ]), */
    transition('no => yes', [
        animate('400ms ease-in')
    ]),
]);

export const slideAnimation = trigger('slideAnimation', [
    // state('close', style( { opacity: 0, transform: 'translateX(-40px)' }) ),
    // state('open', style( { opacity: 1, transform: 'translateX(0)' }) ),
    transition('close => open', [ // each time the binding value changes
        // query('.block > *, .filterbar', style({ opacity: 0, transform: 'translateX(-40px)' })),

        // query('.animation-enter-children > *, .filterbar', stagger(50, [
        //     style({ opacity: 0, transform: 'translateX(-40px)' }),
        //     animate('1s ease-out'),
        // ])),

        /* query('.block', [
            animate(1000, style('*'))
        ]) */
    ]),
    transition('* => open', animate('1000ms ease-in'))
    /* transition('* => void', [
        query('div', style({ opacity: 0, transform: 'translateX(-40px)' })),
    ]) */
]);

export const scaleAnimation = trigger('scaleAnimation', [
    state('inactive', style({
        transform: 'scale(1)',
    })),
    state('active', style({
        transform: 'scale(3)',
    })),
    transition('inactive => active', animate('100ms ease-in')),
]);

export const slideInOutAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('slideInOutAnimation', [

        // end state styles for route container (host)
        state('*', style({
            // the view covers the whole screen with a semi tranparent background
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.8)'
        })),

        // route 'enter' transition
        transition(':enter', [

            // styles at start of transition
            style({
                // start with the content positioned off the right of the screen,
                // -400% is required instead of -100% because the negative position adds to the width of the element
                right: '-400%',

                // start with background opacity set to 0 (invisible)
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }),

            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to 0 which slides the content into view
                right: 0,

                // transition the background opacity to 0.8 to fade it in
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }))
        ]),

        // route 'leave' transition
        transition(':leave', [
            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to -400% which slides the content out of view
                right: '-400%',

                // transition the background opacity to 0 to fade it out
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }))
        ])
    ]);



export const slideInDownAnimation: AnimationEntryMetadata =
    trigger('routeAnimation', [
        state('*',
            style({
                opacity: 1,
                transform: 'translateX(0)'
            })
        ),
        transition(':enter', [
            style({
                opacity: 0,
                transform: 'translateX(-50%)'
            }),
            animate('0.8s ease-in')
        ]),
        transition(':leave', [
            animate('1s ease-out', style({
                opacity: 0,
                transform: 'translateX(150%)'
            }))
        ])
    ]);

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
    /* order */
    /* 1 */ query(':enter, :leave', style({ position: 'absolute', width: '100%' })
            , { optional: true }),
    /* 2 */ group([  // block executes in parallel
            query(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('0.2s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('0.2s ease-in-out', style({ transform: 'translateX(-100%)' }))
            ], { optional: true }),
        ])
    ])
]);
