<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/56413673?v=4',
    name: 'Alihan Saraç',
    title: 'Core Developer',
    links: [
      { icon: 'github', link: 'https://github.com/saracalihan' },
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/72814680?v=4',
    name: 'Arif Karakılıç',
    title: 'Core Developer',
    links: [
      { icon: 'github', link: 'https://github.com/Arifkarakilic' },
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/73403124?v=4',
    name: 'Burak Açıker',
    title: 'Core Developer',
    links: [
      { icon: 'github', link: 'https://github.com/burakack' },
    ]
  },
  {
    avatar: 'https://pbs.twimg.com/profile_images/1563539483437330434/TYayf485_400x400.jpg',
    name: 'Burak Yücel',
    title: 'UI Designer',
    links: [
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/burakyucel' },
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/2325140?v=4',
    name: 'Özgür Işıklı',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/ozziest' },
      { icon: 'twitter', link: 'https://twitter.com/iozguradem' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/ozguradem' },
    ]
  },
]
</script>

# Team

Say hello to the team!

We are just a group of developers that like open-source projects and discover new ideas by trying to implement our imagination.

We believe that collaboration and sharing knowledge are key to innovation and progress. Our goal is to create software that is both functional and accessible to all.

We welcome feedback and contributions from anyone who shares our passion for technology and creativity.

Thank you for your interest in our work!

<VPTeamMembers size="small" :members="members" />
