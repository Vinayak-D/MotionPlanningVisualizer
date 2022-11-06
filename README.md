# Motion Planning Algorithm Visualizer
Visualize the well known A*, RRT, and RRT* path planning algorithms


PROJECT LINK!: https://vinayak-d.github.io/MotionPlanningVisualizer


Welcome to Motion Planning Algorithm Visualizer, please click the link above to try it yourself! Choose Dubai or Las Vegas maps, or define your own grid with obstacles!

Works best on desktop, on mobile the layout might be skewed, however the functionality is identical.


In this application, you can visualize three common algorithms for path planning.


**1: A-Star Search:** This is a very popular grid based search method which attempts to find a shortest path from a start to an end location whilst avoiding obstacles.


**1: Rapidly Exploring Random Trees (RRT):** This is a tree based algorithm which does not find the shortest path, however it is popular in robotics due to it's ability to rapidly search spaces by random sampling, thus making it exponentially faster than A* for high resolution grids.


**1: Informed Rapidly Exploring Random Trees Star (RRT-Star):** The iRRT* improves upon the RRT and RRT* algorithms. Firstly, at each step a minimum cost path is found and then the tree is rewired. The basic premise of RRT* is to aim to achieve a shortest path by optimization at each time step. Informed RRT* samples within an ellipse once an initial path is found.


A common distinction to make is that A* is search based while RRT/RRT* is sampling based. With RRT/RRT* you do not need to search every single grid element, however with A* you explore a significantly greater number of points.


In robotics and autonomous driving, all three algorithms are commonly used depending on the situation.


**RRT Algorithm paper:** https://www.cs.csustan.edu/~xliang/Courses/CS4710-21S/Papers/06%20RRT.pdf


**RRT-Star Algorithm Paper:** https://journals.sagepub.com/doi/pdf/10.1177/0278364911406761?casa_token=hTi_R29RJT0AAAAA:h1i6iPWRjIRL-QgA5JLQh0jllKzlr3qy8C1FGcHdtiAcbr5o874bdbXNLJozdrT_taEojghqRURm


**Informed RRT-Star Algorithm Paper:** https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=6942976&casa_token=fN_eWGUGsHYAAAAA:UMze-G7ZmRlxWSEC0PxUA0OPJSsYw53odwa41YE8rrPcQpfVD_2Y8CmO9QBbKX7qN33iz5ds4g&tag=1


**A-Star Algorithm Paper:** https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=4082128&casa_token=D2_oQWUcn4cAAAAA:LFALmWanWAKd8j9XHH1adF1L0UL8z4-pRWRcyZB2ZAX7cv1b55H9Z9AbQmIv1M9qDlp5ZWbOeg


This project was inspired from the very popular https://clementmihailescu.github.io/Pathfinding-Visualizer/#, this lets you visualize more algorithms (Djikstra, BFS), however RRT
algorithms are not covered there.


To learn more about RRT algorithms, check out my Udemy course: https://www.udemy.com/course/an-introduction-to-sampling-based-motion-planning-algorithms/

