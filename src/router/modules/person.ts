import Profile from '@/views/person/profile/Profile.vue';

const persons = [
    {
        path: '/person/profile/:address',
        name: 'Profile',
        des: 'personal profile',
        component: Profile,
    },
];

export default persons;
