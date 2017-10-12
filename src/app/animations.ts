import { trigger, animate, transition, group, style, query, state, stagger } from '@angular/animations';
import { AnimationEntryMetadata } from '@angular/core';

/**
 * Animate router transition (opacity) and animate-enter (slide + opacity) classes
 */
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
            ])
        ])
    ]
    );

/**
 * Animate SchemeCards (opacity; No stagger animation)
 */
export const slideTileAnimation = trigger('slideTileAnimation', [
    state('no', style({
        opacity: 0
    })),
    state('yes', style({
        opacity: 1
    })),
    transition('no => yes', [
        animate('400ms ease-in')
    ]),
]);
